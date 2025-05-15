export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
  
    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_3LC}${id}`);
  
      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const data = await res.json();
      console.log(data);
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  