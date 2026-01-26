// This service acts as a bridge between your React App and the WeChat Environment.

// Define types for WeChat JS-SDK (simplified)
declare global {
  interface Window {
    wx: any;
    WeixinJSBridge: any;
  }
}

export const isWeChatBrowser = (): boolean => {
  return /MicroMessenger/i.test(navigator.userAgent);
};

// 1. LOGIN: Getting the user's identity
export const loginWithWeChat = async (): Promise<{ openId: string; nickname: string } | null> => {
  if (!isWeChatBrowser()) {
    console.log("Not in WeChat, skipping auth.");
    return null;
  }

  // In a real app, you would redirect to a specific URL to get the 'code'
  // const appId = 'YOUR_APP_ID';
  // const redirectUri = encodeURIComponent(window.location.href);
  // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
  
  // For now, we return a mock success
  return { openId: 'mock_openid_123456', nickname: '微信用户' };
};

// 2. PAYMENT: The real money transaction
export const requestWeChatPayment = async (orderData: { title: string; price: number }): Promise<boolean> => {
  if (!isWeChatBrowser()) {
    // Fallback for PC testing
    console.log("Simulating PC Payment for:", orderData);
    return new Promise(resolve => setTimeout(() => resolve(true), 1500));
  }

  try {
    // STEP 1: Call YOUR backend to create an order
    // const res = await fetch('https://your-api.com/api/create-order', {
    //   method: 'POST',
    //   body: JSON.stringify({ amount: orderData.price, title: orderData.title })
    // });
    // const paymentParams = await res.json(); 

    // STEP 2: Call WeChat's Bridge to popup the password window
    return new Promise((resolve, reject) => {
      const onBridgeReady = () => {
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', 
          {
            // These params come from YOUR backend (STEP 1)
            "appId": "wx2421b1c4370ec43b",     // Public Account ID
            "timeStamp": "1395712654",         // Timestamp
            "nonceStr": "e61463f8efa94090b1f366cccfbbb444", // Random string
            "package": "prepay_id=u802345jgfjsdfgsdg888",     // The Order ID
            "signType": "MD5",                 // Signature Type
            "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" // Security Signature
          },
          function(res: any){
            if(res.err_msg === "get_brand_wcpay_request:ok" ){
               resolve(true); // Payment Success
            } else {
               reject(false); // User cancelled or failed
            }
          }
        );
      };

      if (typeof window.WeixinJSBridge === "undefined"){
         if(document.addEventListener){
             document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
         }
      } else {
         onBridgeReady();
      }
    });

  } catch (error) {
    console.error("Payment setup failed", error);
    return false;
  }
};
