function DateFormat(date: string) {
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    // Year not set (most likely)
    if (year < 1900) return "N/A";

    return `${day}-${month}-${year}`;
}

function DecodeRoleList(encodedRoles: string): number[] {
    try {

        const binaryString = atob(encodedRoles);
        const roles: number[] = [];

        for (let i = 0; i < binaryString.length; i++) {
            roles.push(binaryString.charCodeAt(i));
        }

        return roles;
        
    } catch (error) {
        console.error("Error decoding role list:", error);
        return [];
    }
}

const RoleMap = [
    {
        name: "Admin",
        colour: "#EA7B7B"
    },
    {
        name: "Moderator",
        colour: "#5A9CB5"
    },
    {
        name: "User",
        colour: "#97A87A"
    }
]

export { 
    DateFormat, 
    DecodeRoleList,
    RoleMap,
}