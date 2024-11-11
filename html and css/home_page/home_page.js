// Sample data for blog posts
const blogs = [
    { title: "Campus Life", author: "Alice", excerpt: "Experience the day in the life of a college student." },
    { title: "Study Tips", author: "Bob", excerpt: "Effective study habits to ace your exams!" },
    { title: "Events Around Campus", author: "Carol", excerpt: "Check out upcoming events and gatherings." },
  ];
  
  // Function to display blogs on the homepage
  function loadBlogs() {
    const blogContainer = document.getElementById('blogs');
    blogs.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.classList.add('blog-card');
  
      blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p><strong>Author:</strong> ${blog.author}</p>
        <p>${blog.excerpt}</p>
      `;
  
      blogContainer.appendChild(blogCard);
    });
  }
  
  // Function for 'Browse' button click (placeholder function)
  function browsePosts() {
    alert('Browse button clicked!');
  }
  
  // Load blogs when the page loads
  window.onload = loadBlogs;
  