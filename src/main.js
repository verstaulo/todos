document.addEventListener('DOMContentLoaded', init);

async function init(){
    const select = document.querySelector('#countOfPosts');
    let countOfPostsRequest =  Number(select.value);
    const searchInput = document.querySelector('#search');
    const searchStatus = document.querySelector(".search_status");
    const progressBar = document.querySelector(".progress");
    const postsList = document.querySelector("#posts");


    showProgress(true);
    let posts = await getPosts(countOfPostsRequest);
    renderPost(posts);
    attachEvents();
    async function getPosts(countOfPosts = 10) {
        let posts = [];
        // showProgress(true);
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_limit=${countOfPosts}`
            );
            posts = await response.json();
        } catch (e) {
            console.log('Error');
        } finally {
            showProgress(false);
        }
        return posts;
    }
    function renderPost(posts) {
        postsList.innerHTML = null;
        showProgress(false);
        if (!posts.length) {
            searchResultEmpty('Совпадений не найдено!');
        }
        posts.forEach((el, idx) => {
            postsList.appendChild(createPostElement(idx, el?.title));
        });
    }
    function attachEvents(){
        searchInput.addEventListener('keydown', startSearchByKeypress);
        select.addEventListener('change', reload);
    }

    function startSearchByKeypress(e) {
        if (event.key == "Enter") {
            const searchRequest = this.value.toLowerCase().trim();
            setTimeout(()=>{
                searchPost(searchRequest);
            },500)
        } else if (event.key === "Backspace" && this.value.length===1){
            renderPost(posts);
        }
    }

    async function reload () {
        posts = await getPosts(Number(document.querySelector('#countOfPosts').value));
        renderPost(posts);
    }
    function searchPost(searchRequest) {
        searchStatus.innerHTML = null;
        showProgress(true);
        const searchResult = searchRequest
            ? posts.filter(({ title }) => title.toLowerCase().trim().includes(searchRequest))
            : posts;
        setTimeout(()=> {
            renderPost(searchResult);
        },500);
    }
    function createPostElement(idx, title) {
        const post = document.createElement('li');
        post.classList.add('collection-item', 'hoverable', 'blue', 'lighten-5');
        post.textContent = `${idx + 1} - ${title}`;
        return post;
    }
    function searchResultEmpty (message = '') {
        searchStatus.innerHTML = message;
    }
    function showProgress (state = false) {
        if (state) {
            progressBar.classList.remove("hide");
            postsList.classList.add("hide");
        } else {
            progressBar.classList.add('hide');
            postsList.classList.remove('hide');
        }
    }
}