import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface Music {
    id: number;
    title: string;
    artist: string;
    duration: number;
    yearOfPublication: number;

}

let baseuri: string = "http://anbo-bookstorerest.azurewebsites.net/api/books"

function musicToString(music: Music): string{
    return music.id + " " + music.title + " " + music.artist + " " + music.duration + " " + music.yearOfPublication;
    }

let getAllButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getAllButton");
getAllButton.addEventListener("click", showAllMusic);

let getByIdButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getByIdButton");
getByIdButton.addEventListener("click", get);


    function musicArrayToList (music: Music[]): string {
        if (music.length == 0) {
            return "empty";
        }
        let result: string = "<ul class='list-group' id='musiclist' >";
        music.forEach((music: Music) => {
            result += "<li class='list-group-item'>" + musicToString(music) + "</li>";
        });
        result += "</ul>";
        return result;
    }

    function showAllMusic(): void {
        let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("content");
        axios.get<Music[]>(baseuri)
            .then(function (response: AxiosResponse<Music[]>): void {
                // element.innerHTML = generateSuccessHTMLOutput(response);
                // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
                // outputHtmlElement.innerHTML = JSON.stringify(response.data);
                let result: string = "<ul id='musiclist'>";
                response.data.forEach((music: Music) => {
                    result += "<li>" + music.id + " " + music.title + " " + music.artist + " " + music.duration + " " + music.yearOfPublication + "</li>";
                });
                result += "</ul>";
                outputElement.innerHTML = musicArrayToList(response.data);
            })
            .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
                if (error.response) {
                    // the request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                    outputElement.innerHTML = error.message;
                } else { // something went wrong in the .then block?
                    outputElement.innerHTML = error.message;
                }
            });
        }

        function getByTitle(): void {
            console.log("getByTitle");
            let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
            let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDeleteOrGetById");
            let title: string = inputElement.value;
            let uri: string = baseuri + "/" + title;
            axios.get<Music>(uri)
                .then((response: AxiosResponse) => {
                    if (response.status == 200) {
                        outputElement.innerHTML = response.status + " " + musicToString(response.data);
                    } else {
                        outputElement.innerHTML = "No such music, title: " + title;
                    }
                })
                .catch((error: AxiosError) => {
                    outputElement.innerHTML = error.code + " " + error.message
                })
        }
        