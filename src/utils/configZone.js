
export const getZoneDetails = () => {
    const zone = import.meta.env.VITE_ZONE

    
    switch(zone.toUpperCase()) {
        case "C":
            return {
                logo : "/assets/zone/C/logo.svg",
                loginHead : "/assets/zone/C/login_head.svg",
                theme: "/assets/zone/C/theme.css"
            } 
        case "A":
                return {
                    logo : "/assets/zone/A/logo.png",
                    loginHead : "/assets/zone/A/logo.png",
                    theme: "/assets/zone/A/theme.css"
                } 
        default:
            return {
                logo : "/assets/zone/Default/logo.png",
                loginHead : "/assets/zone/Default/logo.png",
                theme: "/assets/zone/Default/theme.css"
            } 
    } 
}