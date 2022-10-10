export class warship {
    id: number;
    rank: string;
    type: string;
    typecn: string;
    name: string;
    shortname: string;
    colour: string;
    points?: number;
    popularity?: number;
    static  buildWarShip(warship:any) {
        let colour = "";
        if (warship != null) {
            if (warship.rank == "S+") {
                colour = "#eb8334"
            } else if (warship.rank == "S") {
                colour = "#b434eb"
            }else if (warship.rank == "A") {
                colour = "#344ceb"
            }else if (warship.rank == "B") {
                colour = "#6eeb34"
            }else if (warship.rank == "C") {
                colour = "#7d7d7c"
            }
        }
        return {
            id: warship.id,
            rank: warship.rank,
            type: warship.type,
            typecn: warship.typecn,
            name: warship.name,
            shortname: warship.shortname,
            colour: colour,
            points: null,
            popularity:warship.popularity
        }
    }
}

export class warshipGroup{
    disabled?: boolean;
    name: string;
    namecn: string;
    warships: warship[];
}