const FOX_MOVIES_LIST = './dist/mockups/movies-list.json';

export function getMoviesList() {
    return new Promise((resolve, reject) => {
        fetch(FOX_MOVIES_LIST, {
            method: 'get'
        }).then((response) => {
            let contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
                response.json().then((json) => {
                    if (json.moviesList && json.moviesList.length) {
                        resolve(json.moviesList);
                    } else {
                        reject('getMoviesList error');
                    }
                }).catch((err) => {
                    // error
                    reject(err);
                });
            }
        }).catch((err) => {
            // error
            reject(err);
        });
    });
}