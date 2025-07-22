export const fetchCarImage = async (carName: string): Promise<string | null> => {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(carName)}&format=json&origin=*`
    );
    const searchData = await searchRes.json();
    const pageId = searchData?.query?.search?.[0]?.pageid;
    if (!pageId) return null;

    const imageRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pageids=${pageId}&format=json&pithumbsize=600&origin=*`
    );
    const imageData = await imageRes.json();
    const page = imageData?.query?.pages?.[pageId];
    return page?.thumbnail?.source || null;
  } catch (err) {
    console.error("Greška kod dohvaćanja slike s Wikipedije:", err);
    return null;
  }
};
