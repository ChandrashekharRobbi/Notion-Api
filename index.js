const axios = require("axios")
const { Client } = require("@notionhq/client")

const notion = new Client({auth: process.env.NOTION_KEY})

const pokeArray = []

async function getPokemon() {
  for (let i = 1 ; i <= 20; i++){
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
      .then((poke) => {
        const sprite = (!poke.data.sprites.front_default) ? poke.data.sprites.other['official-artwork'].front_default : poke.data.sprites.front_default

        const pokeData = {
            "name": poke.data.species.name,
            "number": poke.data.id,
            "hp": poke.data.stats[0].base_stat,
            "height": poke.data.height,
            "weight": poke.data.weight,
            // "hp": ,
            "attack": poke.data.stats[1].base_stat,
            "defense": poke.data.stats[2].base_stat,
            "special-attack": poke.data.stats[3].base_stat,
            "special-defense": poke.data.stats[4].base_stat,
            "speed": poke.data.stats[5].base_stat,
            "sprite": poke.data.sprites.front_default,
            "artwork": poke.data.sprites.other['official-artwork'].front_default,
            // "sprite": ,
            // "artwork": ,
            // "bulbURL": 
          }
      pokeArray.push(pokeData)
      console.log(`Fetching ${pokeData.name} from PokeAPI`)
    })
    .catch((error) => {
      console.log(error)
  })
  }
  
  console.log(`lets Create Page in Notion of ${pokeArray[0].name}`)
  createNotionPage()
}

getPokemon()


async function createNotionPage() {
  
  for (let pokemon of pokeArray) {
    console.log("Sending data to Notion.....")
    const response = await notion.pages.create({
      "parent" : {
        "type": "database_id",
        "database_id" : process.env.NOTION_DATABASE_ID
      },
      "properties" : {
        "Name":{
          "title":[
            {
              "type": "text",
              "text":{
                "content": pokemon.name
              }
            }
          ]
        },
        "No":{
          "number": pokemon.number
        },
        "HP" : {"number": pokemon.hp },
        "Attack": { "number": pokemon.attack },
        "Defense": { "number": pokemon.defense },
        "Sp. Attack": { "number": pokemon['special-attack'] },
        "Sp. Defense": { "number": pokemon['special-defense'] },
        "Speed": { "number": pokemon.speed },
        "Height": { "number": pokemon.height },
        "Weight": { "number": pokemon.weight }
        
      }
    })
    console.log("Successfully Created Page in Notion 👍")
    
    // console.log(response)
  }
  
  
  
}























