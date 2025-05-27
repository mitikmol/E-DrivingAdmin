import { Add, ArrowBack, Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import QuizManagement from './QuizManagment';

const LessonManagement = ({ courseId, onBack }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    content: '',
    media_url: '',
    media_type: '',
    position: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleQuizNavigate = (lessonId) => {
    const selected = lessons.find(l => l.id === lessonId);
    setSelectedLesson(selected);
  };

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`https://driving-backend-stmb.onrender.com/api/lessons/course/${courseId}`);
      setLessons(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch lessons');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleDeleteClick = (id) => {
    setLessonToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`https://driving-backend-stmb.onrender.com/api/lessons/${lessonToDelete}`);
      setSuccess('Lesson deleted successfully');
      fetchLessons();
    } catch (err) {
      setError('Failed to delete lesson');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
    }
  };

  const handleAddClick = () => {
    setCurrentLesson({
      title: '',
      content: '',
      media_url: '',
      media_type: '',
      position: lessons.length + 1,
    });
    setSelectedFile(null);
    setAddDialogOpen(true);
  };

  const handleEditClick = (lesson) => {
    setCurrentLesson(lesson);
    setSelectedFile(null);
    setEditDialogOpen(true);
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson({ ...currentLesson, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('title', currentLesson.title);
    formData.append('content', currentLesson.content);
    formData.append('media_url', currentLesson.media_url);
    formData.append('media_type', currentLesson.media_type);
    formData.append('position', currentLesson.position);
    formData.append('course_id', courseId);
    
    if (selectedFile) {
      formData.append('document', selectedFile);
    }
    
    return formData;
  };


  const handleAddSubmit = async () => {
    try {
      setIsAdding(true);
      const formData = createFormData();
      await axios.post('https://driving-backend-stmb.onrender.com/api/lessons/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Lesson added successfully');
      setAddDialogOpen(false);
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add lesson');
    } finally {
      setIsAdding(false);
    }
  };

 const handleEditSubmit = async () => {
    try {
      setIsEditing(true);
      const formData = createFormData();
      await axios.put(`https://driving-backend-stmb.onrender.com/api/lessons/${currentLesson.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Lesson updated successfully');
      setEditDialogOpen(false);
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update lesson');
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }
  
  if (selectedLesson) {
    return (
      <QuizManagement 
        lessonId={selectedLesson.id} 
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  const renderFileUpload = (isEdit = false) => (
    <>
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id={isEdit ? 'edit-pdf-upload' : 'add-pdf-upload'}
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor={isEdit ? 'edit-pdf-upload' : 'add-pdf-upload'}>
        <Button
          variant="outlined"
          component="span"
          fullWidth
          sx={{ mb: 2 }}
        >
          {selectedFile ? selectedFile.name : `Upload ${isEdit ? 'Updated ' : ''}PDF Document`}
        </Button>
      </label>
    </>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">Manage Lessons</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          sx={{ ml: 'auto' }}
        >
          Add Lesson
        </Button>
      </Box>

      <List>
        {lessons.map((lesson) => (
          <React.Fragment key={lesson.id}>
            <ListItem
            secondaryAction={
      <Box>
        <IconButton 
          edge="end" 
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(lesson);
          }} 
          sx={{ mr: 1 }}
        >
          <Edit />
        </IconButton>
        <IconButton 
          edge="end" 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(lesson.id);
          }}
        >
          <Delete />
        </IconButton>
      </Box>
    }

              onClick={() => handleQuizNavigate(lesson.id)}
              sx={{ 
      cursor: 'pointer', 
      '&:hover': { 
        backgroundColor: 'action.hover' // Theme-aware hover color
      }  }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip label={`#${lesson.position}`} size="small" sx={{ mr: 2 }} />
                    <Typography variant="subtitle1">{lesson.title}</Typography>
                  </Box>
                }
                secondary={lesson.content.substring(0, 100) + (lesson.content.length > 100 ? '...' : '')}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Add Lesson Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Lesson</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={currentLesson.title}
            onChange={handleLessonChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Content"
            name="content"
            value={currentLesson.content}
            onChange={handleLessonChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Media URL"
            name="media_url"
            value={currentLesson.media_url}
            onChange={handleLessonChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Media Type"
            name="media_type"
            value={currentLesson.media_type}
            onChange={handleLessonChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          {renderFileUpload()}
          <TextField
            margin="dense"
            label="Position"
            name="position"
            type="number"
            value={currentLesson.position}
            onChange={handleLessonChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
           <Button onClick={handleAddSubmit} variant="contained" disabled={isAdding}>
      {isAdding ? <CircularProgress size={24} /> : 'Add'}
    </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Lesson</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={currentLesson.title}
            onChange={handleLessonChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Content"
            name="content"
            value={currentLesson.content}
            onChange={handleLessonChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Media URL"
            name="media_url"
            value={currentLesson.media_url}
            onChange={handleLessonChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Media Type"
            name="media_type"
            value={currentLesson.media_type}
            onChange={handleLessonChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          {renderFileUpload(true)}
          <TextField
            margin="dense"
            label="Position"
            name="position"
            type="number"
            value={currentLesson.position}
            onChange={handleLessonChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
           <Button onClick={handleEditSubmit} variant="contained" disabled={isEditing}>
      {isEditing ? <CircularProgress size={24} /> : 'Save'}
    </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this lesson? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" disabled={isDeleting}>
      {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
    </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};



const ManageCourses = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', image: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);




  
  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://driving-backend-stmb.onrender.com/api/admin/course/all');
      setCourses(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.price || !form.image) {
      setError('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('image', form.image);

      await axios.post('https://driving-backend-stmb.onrender.com/api/courses/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({ title: '', description: '', price: '', image: null });
      setSuccess('Course added successfully');
      fetchCourses();
    } catch (err) {
      setError('Failed to add course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://driving-backend-stmb.onrender.com/api/courses/${courseToDelete}`);
      setSuccess('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      setError('Failed to delete course');
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }

  if (selectedCourse) {
    return <LessonManagement courseId={selectedCourse.id} onBack={handleBackToCourses} />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Manage Courses
      </Typography>

      {/* Add Course Form */}
      <Card sx={{ 
        mb: 4, 
        p: 2, 
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#f5f5f5'
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : 'inherit',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              variant="outlined"
              type="number"
              sx={{
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : 'inherit',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={2}
              value={form.description}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : 'inherit',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{ 
                margin: '1rem 0',
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
              sx={{ px: 4 }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Adding...' : 'Add Course'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s', 
                '&:hover': { transform: 'translateY(-5px)', cursor: 'pointer' } 
              }}
              onClick={() => handleCourseClick(course)}
            >
              <CardMedia
                component="img"
                height="200"
                image={course.image_url}
                alt={course.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{course.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(course.id);
                  }}
                  color="error"
                  variant="outlined"
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageCourses;