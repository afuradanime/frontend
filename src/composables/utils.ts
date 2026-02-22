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

// Bro whatever
const TagMap = [
    "",
    "Action",
    "Adventure",
    "Racing",
    "Comedy",
    "Avant Garde",
    "Mythology",
    "Mystery",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Strategy Game",
    "Hentai",
    "Historical",
    "Horror",
    "Kids",
    "",
    "Martial Arts",
    "Mecha",
    "Music",
    "Parody",
    "Samurai",
    "Romance",
    "School",
    "Sci-Fi",
    "Shoujo",
    "Girls Love",
    "Shounen",
    "Boys Love",
    "Space",
    "Sports",
    "Super Power",
    "Vampire",
    "",
    "",
    "Harem",
    "Slice of Life",
    "Supernatural",
    "Military",
    "Detective",
    "Psychological",
    "Suspense",
    "Seinen",
    "Josei",
    "",
    "",
    "Award Winning",
    "Gourmet",
    "Workplace",
    "Erotica",
    "Adult Cast",
    "Anthropomorphic",
    "CGDCT",
    "Childcare",
    "Combat Sports",
    "Delinquents",
    "Educational",
    "Gag Humor",
    "Gore",
    "High Stakes Game",
    "Idols (Female)",
    "Idols (Male)",
    "Isekai",
    "Iyashikei",
    "Love Polygon",
    "Magical Sex Shift",
    "Mahou Shoujo",
    "Medical",
    "Organized Crime",
    "Otaku Culture",
    "Performing Arts",
    "Pets",
    "Reincarnation",
    "Reverse Harem",
    "Love Status Quo",
    "Showbiz",
    "Survival",
    "Team Sports",
    "Time Travel",
    "Video Game",
    "Visual Arts",
    "Crossdressing",
    "Urban Fantasy",
    "Villainess",
]

export { 
    DateFormat, 
    DecodeRoleList,
    TranslateDayOfWeek,
    TranslateDuration,
    RoleMap,
    TagMap
}