import { NextRequest, NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase/static';

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids');
  if (!ids) {
    return NextResponse.json({ businesses: [] });
  }

  const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
  if (idList.length === 0 || idList.length > 4) {
    return NextResponse.json({ businesses: [] });
  }

  const supabase = createStaticClient();

  const { data: bizData, error: bizError } = await supabase
    .from('businesses')
    .select('id, slug, name, city, county, rating, review_count, emergency_24_7, manifest_provided, phone, website, is_verified')
    .in('id', idList);

  if (bizError || !bizData?.length) {
    return NextResponse.json({ businesses: [] });
  }

  // Get services
  const { data: junctions } = await supabase
    .from('business_services')
    .select('business_id, service_id')
    .in('business_id', bizData.map((b) => b.id));

  const serviceIds = [...new Set((junctions || []).map((j) => j.service_id))];
  const serviceMap = new Map<string, string>();
  if (serviceIds.length) {
    const { data: serviceData } = await supabase
      .from('service_types')
      .select('id, name')
      .in('id', serviceIds);
    for (const s of serviceData || []) {
      serviceMap.set(s.id, s.name);
    }
  }

  const bizServiceMap = new Map<string, string[]>();
  for (const j of junctions || []) {
    if (!bizServiceMap.has(j.business_id)) bizServiceMap.set(j.business_id, []);
    const name = serviceMap.get(j.service_id);
    if (name) bizServiceMap.get(j.business_id)!.push(name);
  }

  const businesses = bizData.map((b) => ({
    ...b,
    services: bizServiceMap.get(b.id) || [],
  }));

  // Maintain order from request
  const ordered = idList
    .map((id) => businesses.find((b) => b.id === id))
    .filter(Boolean);

  return NextResponse.json({ businesses: ordered });
}
