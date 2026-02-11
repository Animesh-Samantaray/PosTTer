export const getInitials=(title)=>{
if(!title) return "";

const words = title.split(" ");
let initials= "";

for(let i=0;i<Math.min(words.length,2);i++){
    initials+=words[i][0]
}
return initials.toUpperCase();
}


export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(email);
};
