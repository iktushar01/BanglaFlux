import { CategoryPageClient } from "@/components/modules/iptv/CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return <CategoryPageClient slug={category} />;
}
