const rules = {
  advocate: {
    static: [
      "dashboard:visit",
      "pcm:list",
      "pcm:edit",
      "calender:visit",
      "account:edit",
      "subscription:visit",
      "citation:visit",
      "documenting:visit",
      "login:visit",
      "editaccount:visit"      
    ]
  },
  administrator: {
    static: [
      "login:visit",
      "admin-dashboard:visit",
      "editaccount:visit"  
    ]
    
  },
  support: {
    static: [
      "login:visit",
      "admin-dashboard:visit"
    ]
  },
  default: {
    advocate:  "/home",
    admin: "/admin-dashboard",
    support: "/admin-dashboard",
    "": "/"
  }
};

export default rules;

// dynamic: {
//       "posts:edit": ({userId, postOwnerId}) => {
//         if (!userId || !postOwnerId) return false;
//         return userId === postOwnerId;
//       }
//     }