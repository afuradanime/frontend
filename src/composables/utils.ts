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

function TranslateDayOfWeek(day: string): string {
    const days = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];
    const translatedDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

    const index = days.indexOf(day);
    return translatedDays[index] || day;
}

function TranslateDuration(duration: string): string {
    return duration.replace("min per ep", "min por ep");
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
    TranslateDayOfWeek,
    TranslateDuration,
    RoleMap,
}