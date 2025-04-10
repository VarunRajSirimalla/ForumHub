import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../contexts/CategoryContext';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading, faAlignLeft, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Validate required fields
      if (!title.trim() || !content.trim() || !categoryId) {
        throw new Error('Please fill in all fields');
      }

      // Log the data being sent
      console.log('Creating post with data:', { title, content, categoryId });

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, categoryId })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      navigate(`/post/${data.data._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show message
  if (!user) {
    return (
      <Container className="d-flex align-items-center justify-content-center py-5">
        <Alert variant="warning">
          Please <a href="/login">log in</a> to create a post.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center py-5">
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Card className="shadow-lg">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4 fw-bold">Create New Post</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="title">
                <Form.Label className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faHeading} className="me-2" />
                  Title
                </Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="category">
                <Form.Label className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                  Category
                </Form.Label>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="form-control-lg"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option 
                      key={category._id} 
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4" controlId="content">
                <Form.Label className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faAlignLeft} className="me-2" />
                  Content
                </Form.Label>
                <Form.Control
                  as="textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="form-control-lg"
                  style={{ minHeight: '200px' }}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 py-3 mb-3 fw-bold fs-5"
              >
                {loading ? 'Creating Post...' : 'Create Post'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default CreatePost; 