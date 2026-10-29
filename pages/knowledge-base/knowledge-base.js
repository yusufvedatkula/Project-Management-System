//maybe sample initial state with let topics = ["",]
//and let posts = [ {topic:"", text:""}] etc
let topics = ["software issues", "new tool help"]
let posts = [
    {topic: "software issues", text: "I believe theres a bug in our filing system"},
    {topic: "new tool help", text: "can someone explain our new spreadsheet tool to me?"}
];
let activeTopic = topics[0];


const topicForm = document.getElementById('topic-form');
const topicInput = document.getElementById('topic-input');
const topicList = document.getElementById('topic-list');
const postForm = document.getElementById('post-form');
const postInput = document.getElementById('post-input');
const postsContainer = document.getElementById('posts-container');

function renderTopics() {
    topicList.innerHTML = "";

    if (topics.length === 0) {
        topicList.innerHTML = ' <p class="subtitle">No Topics created yet.</p>';
        return;
    }

    topics.forEach(topic => {
        const btn = document.createElement('a');
        btn.href = '#';
        btn.textContent = topic;

        // highlight the selected topic (styled by .active-topic in knowledge-base.css)
        if (topic === activeTopic) {
            btn.classList.add('active-topic');
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            activeTopic = topic;
            renderTopics();
            renderPosts();
        });

        topicList.appendChild(btn);
    });
}
function renderPosts() {
    postsContainer.innerHTML = '';

    // only show the posts for the selected topic, so the topic filter actually filters
    const topicPosts = posts.filter(post => post.topic === activeTopic);
    document.getElementById('posts-heading').textContent = 'Posts in "' + activeTopic + '"';

    if (topicPosts.length === 0) {
        postsContainer.innerHTML = '<p class="subtitle">No posts in this topic yet. Be the first to write one.</p>';
        return;
    }

    topicPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'demo-row';

        // textContent (not innerHTML) so typed text is shown as text, never run as HTML
        const topicLabel = document.createElement('strong');
        topicLabel.textContent = '[' + post.topic + '] ';
        postCard.appendChild(topicLabel);
        postCard.appendChild(document.createTextNode(post.text));

        postsContainer.appendChild(postCard);
    });
}

    topicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTopic = topicInput.value.trim();

        if (newTopic && !topics.includes(newTopic)) {
            topics.push(newTopic);
            activeTopic = newTopic;
            topicInput.value = '';
            renderTopics();
            renderPosts();   // switch the post list to the new (empty) topic
        }
    });

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPostText = postInput.value.trim();

        if(!activeTopic) {
            alert("Please create or select a topic before making a post")
            return;
        }

        if (newPostText) {
            posts.unshift({ topic: activeTopic, text: newPostText });
            postInput.value = '';
            renderPosts();
        }
    });

renderTopics();
renderPosts();
