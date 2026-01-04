import axios from 'axios';
import AiDetectionLog from '../models/AiDetectionLog.js';
import Post from '../models/Post.js'; 

const HATE_SPEECH_API = 'http://localhost:8000/api/check-content';

export const verifyContent = async (req, res, next) => {
  console.log(`\n=== New ${req.method} request to ${req.path} ===`);
  console.log('Request body:', req.body);
  console.log('User from token:', req.user?.id);
  
  if (req.method === 'GET') return next();
  
  try {
    if (req.body.description) {
      const response = await axios.post(HATE_SPEECH_API, {
        text: req.body.description,
        threshold: 0.4
      });

      console.log('AI Detection Result (Post):', response.data);

      if (response.data.data.is_hate) {
        
        try {
          await AiDetectionLog.create({
            userId: req.user?.id,
            content: req.body.description,
            probability: response.data.data.probability,
            contentType: 'post',
            wasBlocked: true,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
          });
          console.log("AI detection log for post created successfully.");
        } catch (dbError) {
          console.error("DATABASE ERROR: Failed to create AiDetectionLog for a POST.", dbError);
        }

        return res.status(400).json({
          message: 'Your post violates our community guidelines',
          isHateSpeech: true,
          confidence: response.data.data.probability
        });
      }
    }

    // FOR COMMENTS/REPLIES 
    if (req.body.comment) {
        const response = await axios.post(HATE_SPEECH_API, {
            text: req.body.comment,
            threshold: 0.4
        });
    
        console.log('AI Detection Result (Comment/Reply):', response.data);
      
        if (response.data.data.is_hate) {
            const postId = req.params.postId || req.body.postId;
            let determinedContentType = req.params.commentId ? 'reply' : 'comment';

            let originalContent = '[Unknown Post]';
            if (determinedContentType !== 'post' && postId) {
                try {
                    const post = await Post.findById(postId).select('description');
                    originalContent = post?.description || '[Deleted Post]';
                } catch (e) { console.error('Error fetching post content:', e); }
            }
        
            try {
                const logData = {
                    userId: req.user?.id,
                    content: req.body.comment,
                    probability: response.data.data.probability,
                    contentType: determinedContentType, 
                    relatedPost: postId,
                    originalContent: originalContent,
                    wasBlocked: true,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                };
                await AiDetectionLog.create(logData);
                console.log(`AI detection log for ${determinedContentType} created successfully.`);
            } catch (dbError) {
                console.error(`DATABASE ERROR: Failed to create AiDetectionLog for a ${determinedContentType}.`, dbError);
            }

            return res.status(400).json({
                message: `Your ${determinedContentType} violates our community guidelines`, 
                isHateSpeech: true,
                confidence: response.data.data.probability
            });
        }
    }
    
    next();
  } catch (error) {
    console.error('Content verification failed:', error.message);
    return res.status(503).json({ 
        message: "Content could not be verified at this time. Please try again later.",
        error: "Service Unavailable"
    });
  }
};