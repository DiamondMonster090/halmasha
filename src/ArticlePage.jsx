import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ArticlePage() {
  const { id } = useParams(); // Get article ID from the URL
  const [article, setArticle] = useState(null); // State for article data
  const [content, setContent] = useState(''); // State for article content

  useEffect(() => {
    axios.get('/halmasha/data/articles.json')
      .then(response => {
        const articleData = response.data.find(article => article.id === parseInt(id));
        if (articleData) {
          setArticle(articleData);

          // Fetch article content
          axios.get(`/halmasha/content/${articleData.contentName}`)
            .then(response => {
              setContent(response.data);
            })
            .catch(error => {
              console.error("Error fetching article content:", error);
            });
        } else {
          console.error("Article not found");
        }
      })
      .catch(error => {
        console.error("Error fetching articles data:", error);
      });
  }, [id]);

  if (!article) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="loading-spinner"></div> {/* DaisyUI spinner */}
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  // Construct image URL with base URL
  const imageUrl = `/halmasha/images/${article.imageName}`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="card bg-gray-200 shadow-xl border border-gray-300 rounded-lg">
        <figure>
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-auto rounded-t-lg border-b border-gray-300"
          />
        </figure>
        <div className="card-body p-6">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">{article.title}</h1>
          <div className="prose prose-xl text-gray-700">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;
