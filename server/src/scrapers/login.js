import axios from "axios";

const getIdDigest = async (email) => {
  try {
    const url = `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/lookup/${email}`;

    const headers = {
      Cookie:
        "zalb_74c3a1eecc=18c2ae8cabb778c688e1dd5418e4505b; zccpn=219d09c8304a6de32227c25b6bb163546037d28404c6828fe818c832ff52e5b1b56aab6630070d699617b522a5436111c13483f0b4b599715eee29ba1c66b1aa; cli_rgn=IN; zalb_3309580ed5=5e41c4a69d62a20d11fee6ef8532db03; CT_CSRF_TOKEN=57984ea3-d386-4edf-b56a-b87774666407; zalb_f0e8db9d3d=7ad3232c36fdd9cc324fb86c2c0a58ad; iamcsr=219d09c8304a6de32227c25b6bb163546037d28404c6828fe818c832ff52e5b1b56aab6630070d699617b522a5436111c13483f0b4b599715eee29ba1c66b1aa; _zcsr_tmp=219d09c8304a6de32227c25b6bb163546037d28404c6828fe818c832ff52e5b1b56aab6630070d699617b522a5436111c13483f0b4b599715eee29ba1c66b1aa; JSESSIONID=64627ACE5A70EDE7DEB676FFDA4A1F40; stk=384a707dfc155c585d500b3ee869edbd",
      "X-ZCSRF-TOKEN":
        "iamcsrcoo=219d09c8304a6de32227c25b6bb163546037d28404c6828fe818c832ff52e5b1b56aab6630070d699617b522a5436111c13483f0b4b599715eee29ba1c66b1aa",
      "content-type": "application/x-www-form-urlencoded",
    };

    const formData = new URLSearchParams();
    formData.append(
      "serviceurl",
      "https://academia.srmist.edu.in/portal/academia-academic-services/redirectFromLogin"
    );

    const response = await axios.post(url, formData.toString(), { headers });
    const data = response.data;

    const id = data.lookup.identifier;
    const digest = data.lookup.digest;

    return { id, digest };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCookies = async (email, password) => {
  const { id, digest } = await getIdDigest(email);

  const url = `https://academia.srmist.edu.in/accounts/p/40-10002227248/signin/v2/primary/${id}/password?digest=${digest}&cli_time=1744860675322&servicename=ZohoCreator&service_language=en&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin`;

  const headers = {
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.9",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    Cookie:
      "zalb_74c3a1eecc=d06cba4b90fbc9287c4162d01e13c516; _ga=GA1.3.1056011460.1744823504; _gid=GA1.3.635174888.1744823504; zalb_f0e8db9d3d=7ad3232c36fdd9cc324fb86c2c0a58ad; stk=a4ccd4b85bd37868861e8771c7f5d578; zalb_3309580ed5=5e41c4a69d62a20d11fee6ef8532db03; CT_CSRF_TOKEN=0ce8b2ac-a8ed-4dc0-a96b-61df62887b66; JSESSIONID=0576A060D80E11468562067564B79352; cli_rgn=IN; zccpn=a750e015622d2033f4705482d3295f3a17c1953fbfa94f0a1d5b2f4dc1022deb7164f43c2987c2e94670aa9c2c8f387c36087231da118722ed04ed168f0732c6; _zcsr_tmp=a750e015622d2033f4705482d3295f3a17c1953fbfa94f0a1d5b2f4dc1022deb7164f43c2987c2e94670aa9c2c8f387c36087231da118722ed04ed168f0732c6; iamcsr=a750e015622d2033f4705482d3295f3a17c1953fbfa94f0a1d5b2f4dc1022deb7164f43c2987c2e94670aa9c2c8f387c36087231da118722ed04ed168f0732c6; _gat=1; _ga_HQWPLLNMKY=GS1.3.1744860674.4.0.1744860674.0.0.0",
    DNT: "1",
    Origin: "https://academia.srmist.edu.in",
    Referer:
      "https://academia.srmist.edu.in/accounts/p/10002227248/signin?hide_fp=true&servicename=ZohoCreator&service_language=en&css_url=/49910842/academia-academic-services/downloadPortalCustomCss/login&dcc=true&serviceurl=https%3A%2F%2Facademia.srmist.edu.in%2Fportal%2Facademia-academic-services%2FredirectFromLogin",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "X-ZCSRF-TOKEN":
      "iamcsrcoo=a750e015622d2033f4705482d3295f3a17c1953fbfa94f0a1d5b2f4dc1022deb7164f43c2987c2e94670aa9c2c8f387c36087231da118722ed04ed168f0732c6",
    "sec-ch-ua": '"Chromium";v="135", "Not-A.Brand";v="8"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
  };

  try {
    const data = { passwordauth: { password } };

    const jsonHeaders = {
      ...headers,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, data, { headers: jsonHeaders });

    const cookies = {};
    const setCookieHeaders = response.headers["set-cookie"];

    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookieHeader) => {
        const cookieName = cookieHeader.split("=")[0];
        const cookieValue = cookieHeader.split("=")[1].split(";")[0];
        cookies[cookieName] = cookieValue;
      });
    }

    return cookies;
  } catch (error) {
    console.error(
      "Error in getCookies:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export { getIdDigest, getCookies };
