export type City = {
  name: string
  slug: string
  conjugation: string
}

export async function getCities(locale?: string): Promise<City[]> {
  //const polishCities = [
    //{"name": "Warszawa", "slug": "systemy-ppoz-warszawa", "conjugation": "w Warszawie"},
    //{"name": "Kraków", "slug": "systemy-ppoz-krakow", "conjugation": "w Krakowie"},
    //{"name": "Łódź", "slug": "systemy-ppoz-lodz", "conjugation": "w Łodzi"},
    //{"name": "Wrocław", "slug": "systemy-ppoz-wroclaw", "conjugation": "we Wrocławiu"},
    //{"name": "Poznań", "slug": "systemy-ppoz-poznan", "conjugation": "w Poznaniu"},
    //{"name": "Gdańsk", "slug": "systemy-ppoz-gdansk", "conjugation": "w Gdańsku"},
    //{"name": "Szczecin", "slug": "systemy-ppoz-szczecin", "conjugation": "w Szczecinie"},
    //{"name": "Bydgoszcz", "slug": "systemy-ppoz-bydgoszcz", "conjugation": "w Bydgoszczy"},
    //{"name": "Lublin", "slug": "systemy-ppoz-lublin", "conjugation": "w Lublinie"},
    //{"name": "Białystok", "slug": "systemy-ppoz-bialystok", "conjugation": "w Białymstoku"},
    //{"name": "Katowice", "slug": "systemy-ppoz-katowice", "conjugation": "w Katowicach"},
    //{"name": "Gdynia", "slug": "systemy-ppoz-gdynia", "conjugation": "w Gdyni"},
    //{"name": "Toruń", "slug": "systemy-ppoz-torun", "conjugation": "w Toruniu"},
    //{"name": "Radom", "slug": "systemy-ppoz-radom", "conjugation": "w Radomiu"},
    //{"name": "Częstochowa", "slug": "systemy-ppoz-czestochowa", "conjugation": "w Częstochowie"},
    //{"name": "Rzeszów", "slug": "systemy-ppoz-rzeszow", "conjugation": "w Rzeszowie"},
    //{"name": "Kielce", "slug": "systemy-ppoz-kielce", "conjugation": "w Kielcach"},
    //{"name": "Gliwice", "slug": "systemy-ppoz-gliwice", "conjugation": "w Gliwicach"},
    //{"name": "Olsztyn", "slug": "systemy-ppoz-olsztyn", "conjugation": "w Olsztynie"},
    //{"name": "Opole", "slug": "systemy-ppoz-opole", "conjugation": "w Opolu"},
    //{"name": "Elbląg", "slug": "systemy-ppoz-elblag", "conjugation": "w Elblągu"},
    //{"name": "Płock", "slug": "systemy-ppoz-plock", "conjugation": "w Płocku"},
    //{"name": "Gorzów Wielkopolski", "slug": "systemy-ppoz-gorzow-wielkopolski", "conjugation": "w Gorzowie Wielkopolskim"},
    //{"name": "Zielona Góra", "slug": "systemy-ppoz-zielona-gora", "conjugation": "w Zielonej Górze"},
    //{"name": "Kalisz", "slug": "systemy-ppoz-kalisz", "conjugation": "w Kaliszu"},
    //{"name": "Legnica", "slug": "systemy-ppoz-legnica", "conjugation": "w Legnicy"},
    //{"name": "Koszalin", "slug": "systemy-ppoz-koszalin", "conjugation": "w Koszalinie"},
    //{"name": "Grudziądz", "slug": "systemy-ppoz-grudziadz", "conjugation": "w Grudziądzu"},
    //{"name": "Jaworzno", "slug": "systemy-ppoz-jaworzno", "conjugation": "w Jaworznie"},
    //{"name": "Sopot", "slug": "systemy-ppoz-sopot", "conjugation": "w Sopocie"},
    //{"name": "Nowy Sącz", "slug": "systemy-ppoz-nowy-sacz", "conjugation": "w Nowym Sączu"},
    //{"name": "Jastrzębie-Zdrój", "slug": "systemy-ppoz-jastrzebie-zdroj", "conjugation": "w Jastrzębiu-Zdroju"},
    //{"name": "Siedlce", "slug": "systemy-ppoz-siedlce", "conjugation": "w Siedlcach"},
    //{"name": "Słupsk", "slug": "systemy-ppoz-slupsk", "conjugation": "w Słupsku"},
    //{"name": "Piła", "slug": "systemy-ppoz-pila", "conjugation": "w Pile"},
    //{"name": "Ostrów Wielkopolski", "slug": "systemy-ppoz-ostrow-wielkopolski", "conjugation": "w Ostrowie Wielkopolskim"},
    //{"name": "Ruda Śląska", "slug": "systemy-ppoz-ruda-slaska", "conjugation": "w Rudzie Śląskiej"},
    //{"name": "Wałbrzych", "slug": "systemy-ppoz-walbrzych", "conjugation": "w Wałbrzychu"},
    //{"name": "Tychy", "slug": "systemy-ppoz-tychy", "conjugation": "w Tychach"},
    //{"name": "Bielsko-Biała", "slug": "systemy-ppoz-bielsko-biala", "conjugation": "w Bielsku-Białej"},
    //{"name": "Pabianice", "slug": "systemy-ppoz-pabianice", "conjugation": "w Pabianicach"},
    //{"name": "Zabrze", "slug": "systemy-ppoz-zabrze", "conjugation": "w Zabrzu"},
    //{"name": "Bytom", "slug": "systemy-ppoz-bytom", "conjugation": "w Bytomiu"},
    //{"name": "Racibórz", "slug": "systemy-ppoz-raciborz", "conjugation": "w Raciborzu"},
    //{"name": "Chorzów", "slug": "systemy-ppoz-chorzow", "conjugation": "w Chorzowie"},
    //{"name": "Lubin", "slug": "systemy-ppoz-lubin", "conjugation": "w Lubinie"},
    //{"name": "Tarnów", "slug": "systemy-ppoz-tarnow", "conjugation": "w Tarnowie"},
    //{"name": "Biała Podlaska", "slug": "systemy-ppoz-biala-podlaska", "conjugation": "w Białej Podlaskiej"},
    //{"name": "Głogów", "slug": "systemy-ppoz-glogow", "conjugation": "w Głogowie"},
    //{"name": "Konin", "slug": "systemy-ppoz-konin", "conjugation": "w Koninie"},
    //{"name": "Leszno", "slug": "systemy-ppoz-leszno", "conjugation": "w Lesznie"},
    //{"name": "Zamość", "slug": "systemy-ppoz-zamosc", "conjugation": "w Zamościu"},
    //{"name": "Przemyśl", "slug": "systemy-ppoz-przemysl", "conjugation": "w Przemyślu"},
    //{"name": "Kędzierzyn-Koźle", "slug": "systemy-ppoz-kedzierzyn-kozle", "conjugation": "w Kędzierzynie-Koźlu"},
    //{"name": "Piotrków Trybunalski", "slug": "systemy-ppoz-piotrkow-trybunalski", "conjugation": "w Piotrkowie Trybunalskim"}
  //];

  // For Polish locale, return cities with conjugation
  //if (locale === "pl") {
    //return polishCities;
  //}

  // For other locales (English, etc.), return cities without conjugation
  // Just use the city name since the dictionary already includes "in"
  //return polishCities.map(city => ({
    //...city,
    //conjugation: city.name
  //}));
}
