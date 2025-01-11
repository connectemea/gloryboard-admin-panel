
export const getZoneDetails = () => {
    const zone = import.meta.env.VITE_ZONE

    
    switch(zone.toUpperCase()) {
        case "C":
            return {
                logo : "/src/assets/zone/C/logo.svg",
                loginHead : "/src/assets/zone/C/login_head.svg",
                theme: "/src/assets/zone/C/theme.css"
            } 
        case "A":
                return {
                    logo : "/src/assets/zone/A/logo.png",
                    loginHead : "/src/assets/zone/A/logo.png",
                    theme: "/src/assets/zone/A/theme.css"
                } 
        default:
            return {
                logo : "/src/assets/zone/Default/logo.png",
                loginHead : "/src/assets/zone/Default/logo.png",
                theme: "/src/assets/zone/Default/theme.css"
            } 
    } 
}