const base_url = "https://dummyjson.com/";

export async function handelRemoteRequest(
  endpoint,
  success,
  faild,
  lodingTrigger
) {
  // handle sucess
  try {
    lodingTrigger("start");
    const response = await fetch(`${base_url}${endpoint}`);
    if (response.ok) {
      const data = await response.json();
      success(data);
      // return data;
    } else {
      throw new Error("something went wrong in fetching data!");
    }
  } catch (e) {
    faild(e.message);
    // console.log(e.message);
  } finally {
    lodingTrigger("end");
    // console.log("fetching data is done");
  }
}
export async function handelRemotePost(
  endpoint,
  faild,
  lodingTrigger,
  data,
  method,
  merged
) {
  try {
    const response = await fetch(`${base_url}${endpoint}`, {
      method: `${method}`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      merge: merged,
    });
    if (true) {
      const data = await response.json();
      // success(data);
      // return data;
    } else {
      throw new Error("something went wrong in fetching data!");
    }
  } catch (e) {
    faild(e.message);
    console.log(e.message);
  } finally {
    lodingTrigger("end");
    console.log("fetching data is done");
  }
}
