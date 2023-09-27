
export async function initTodos(){
    const countOfPostsList = document.querySelector('#countOfPosts');
    const searchInput = document.querySelector('#search');
    const searchStatus = document.querySelector(".search_status");
    const progressBar = document.querySelector(".progress");
    const postsList = document.querySelector("#posts");
    showProgress(true);
    let posts = await getPosts();
    renderPost(posts);
    attachEvents();
    async function getPosts(countOfPosts = 10){
        countOfPosts = Number(countOfPostsList.value);
        let posts = [];
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_limit=${countOfPosts}&_start=2`
            );
            posts = await response.json();
        } catch (e) {
            console.log('Error');
        } finally {
        }
        return posts;
    }
    function renderPost(posts) {
        showProgress(false);
        postsList.innerHTML = null;
        if (!posts.length) {
            searchResultEmpty('Совпадений не найдено!');
        }
        posts.forEach((el, idx) => {
            postsList.appendChild(createPostElement(idx, el?.title));
        });
    }
    function attachEvents(){
        searchInput.addEventListener('keyup', startSearcher);
        countOfPostsList.addEventListener('change', reload);
    }

    function startSearcher(event) {
        switch (event.key) {
            case "Enter" :
                setTimeout(()=>{
                    searchPost(posts);
                },500)
                break;

            case "Backspace" :
                if(!event.target.value) {
                    renderPost(posts);
                }
                break;
        }
    }

    async function reload() {
        posts = await getPosts(countOfPostsList.value);
        renderPost(posts);
        searchPost(posts);
    }

    function searchPost(posts) {
        const searchRequest = searchInput.value.toLowerCase().trim();
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
        post.classList.add('row', 'col', 'hoverable', 'blue', 'lighten-5');
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