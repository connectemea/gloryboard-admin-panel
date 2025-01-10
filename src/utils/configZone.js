
export const getZoneDetails = () => {
    const zone = import.meta.env.VITE_ZONE
    switch(zone) {
        case "C":
            return {
                logo : "/src/assets/zone/C/logo.svg",
                loginHead : "/src/assets/zone/C/login_head.svg"
            } 
        case "A":
                return {
                    logo : "/src/assets/zone/A/logo.png",
                    loginHead : "/src/assets/zone/A/logo.png"
                } 
        default:
            console.error("Invalid Zone")
            break;
    } 
}