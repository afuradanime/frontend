import { SeasonType, type Season } from "@/models/Anime";

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
        name: "Administrador",
        colour: "#EA7B7B"
    },
    {
        name: "Moderador",
        colour: "#5A9CB5"
    },
    {
        name: "Utilizador",
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

function getCurrentSeason(): Season {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const year = now.getFullYear()

    let season: SeasonType
    if ((month == 3 && day >= 20) || (month > 3 && month < 6) || (month == 6 && day < 21)) season = SeasonType.Spring
    else if ((month == 6 && day >= 21) || (month > 6 && month < 9) || (month == 9 && day < 23)) season = SeasonType.Summer
    else if ((month == 9 && day >= 23) || (month > 9 && month < 12) || (month == 12 && day < 22)) season = SeasonType.Fall
    else season = SeasonType.Winter

    return { Season: season, Year: year }
}

export { 
    DateFormat, 
    DecodeRoleList,
    TranslateDayOfWeek,
    TranslateDuration,
    RoleMap,
    getCurrentSeason,
    TagMap
}