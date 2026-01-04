import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'; 
import axios from "axios";
import { 
  TrashIcon, 
  PencilIcon, 
  EyeIcon, 
  ShieldCheckIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon, 
  CheckIcon, 
  ChevronDownIcon,
  CpuChipIcon,
  ShieldExclamationIcon
} from "@heroicons/react/24/outline";
import {
  AdminContainer,
  DashboardContainer,
  DashboardHeader,
  Title,
  StatsContainer,
  StatCard,
  StatTitle,
  StatValue,
  Section,
  SectionHeader,
  SectionTitle,
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  RoleBadge,
  ActionButton,
  ReportedPostContent,
  EmptyState,
  DropdownContainer,
  DropdownButton,
  DropdownContent,
  DropdownItem
} from "../styles/AdminDashboardStyles"; 
import PostModal from "../components/PostModal";


const AdminDashboard = () => {
  const [selectedPostForModal, setSelectedPostForModal] = useState(null);
  const [users, setUsers] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [aiActivities, setAiActivities] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReportedContent: 0, 
    adminUsers: 0,
    aiDetections: 0,
    blockedContent: 0,
    activeReports: 0,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentView, setCurrentView] = useState('users'); 
  
  const viewTitles = {
    users: { title: "User Management", icon: <UserIcon width={18} /> },
    reportedContent: { title: "Reported Content", icon: <ExclamationTriangleIcon width={18} /> }, 
    aiActivities: { title: "AI Model Activities", icon: <CpuChipIcon width={18} /> }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [usersRes, contentRes, aiActivitiesRes] = await Promise.all([
          axios.get("http://localhost:3001/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/admin/reported-content", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/admin/ai-detections", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setUsers(usersRes.data);
        
        const postsWithContentType = (contentRes.data.posts || []).map(post => ({ ...post, contentType: 'post', keyId: `post-${post._id}` }));
        const commentsWithContentType = (contentRes.data.comments || []).map(comment => ({ ...comment, contentType: 'comment', keyId: `comment-${comment._id}` }));
        const repliesWithContentType = (contentRes.data.replies || []).map(reply => ({ ...reply, contentType: 'reply', keyId: `reply-${reply._id}` }));
        
        const combinedContent = [
          ...postsWithContentType,
          ...commentsWithContentType,
          ...repliesWithContentType
        ].sort((a, b) => {
            const dateA = new Date(a.reports?.[0]?.reportedAt || a.createdAt || 0);
            const dateB = new Date(b.reports?.[0]?.reportedAt || b.createdAt || 0);
            return dateB - dateA;
        });
        setReportedContent(combinedContent);

        setAiActivities(aiActivitiesRes.data || []);
        
        setStats({
          totalUsers: usersRes.data.length,
          totalReportedContent: combinedContent.length,
          adminUsers: usersRes.data.filter(u => u.role === 'admin').length,
          aiDetections: (aiActivitiesRes.data || []).length,
          blockedContent: (aiActivitiesRes.data || []).filter(a => a.wasBlocked).length,
          activeReports: combinedContent.filter(c => !c.resolved).length,
        });
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:3001/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(users.filter(user => user._id !== userId));
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          adminUsers: users.find(u => u._id === userId)?.role === 'admin' 
            ? prev.adminUsers - 1 
            : prev.adminUsers
        }));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    try {
      await axios.patch(
        `http://localhost:3001/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      setStats(prev => ({
        ...prev,
        adminUsers: newRole === 'admin' 
          ? prev.adminUsers + 1 
          : prev.adminUsers - 1
      }));
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleDeleteReportedContent = async (item) => {
    const { _id, contentType, postId, commentId } = item; // commentId for replies
    const typeName = contentType.charAt(0).toUpperCase() + contentType.slice(1);
    
    if (window.confirm(`Are you sure you want to delete this ${contentType}? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem("token");
        let endpoint;
        if (contentType === 'post') {
          endpoint = `http://localhost:3001/admin/posts/${_id}`;
        } else if (contentType === 'comment') {
          endpoint = `http://localhost:3001/admin/posts/${postId}/comments/${_id}`;
        } else if (contentType === 'reply') {
          endpoint = `http://localhost:3001/admin/posts/${postId}/comments/${commentId}/replies/${_id}`;
        }

        if (!endpoint) {
            console.error("Invalid content type or missing IDs for deletion:", item);
            throw new Error("Invalid content type or missing IDs for deletion");
        }

        await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        
        const updatedContent = reportedContent.filter(c => c.keyId !== item.keyId);
        setReportedContent(updatedContent);
        setStats(prev => ({
          ...prev,
          totalReportedContent: updatedContent.length,
          activeReports: updatedContent.filter(c => !c.resolved).length,
        }));
        alert(`${typeName} deleted successfully`);
      } catch (error) {
        console.error(`Failed to delete ${contentType}:`, error);
        alert(`Error deleting ${contentType}. Check console for details.`);
      }
    }
  };

  const handleResolveReportedContent = async (item, action) => {
    const { _id, contentType } = item;
    const typeName = contentType.charAt(0).toUpperCase() + contentType.slice(1);
    
    try {
      const token = localStorage.getItem("token");
      let endpoint;
      let payload = { action };

      if (contentType === 'post') {
        endpoint = `http://localhost:3001/posts/${_id}/resolve-report`;
      } else if (contentType === 'comment') {
        endpoint = `http://localhost:3001/comments/${_id}/resolve-report`; 
      } else if (contentType === 'reply') {
        endpoint = `http://localhost:3001/replies/${_id}/resolve-report`;
      }

      if (!endpoint) {
          console.error("Invalid content type for resolution:", item);
          throw new Error("Invalid content type for resolution");
      }

      await axios.patch(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      
      let updatedContent;
      if (action === 'delete') {
        updatedContent = reportedContent.filter(c => c.keyId !== item.keyId);
      } else { 
        updatedContent = reportedContent.map(c => 
          (c.keyId === item.keyId) ? { ...c, resolved: true } : c
        );
      }
      setReportedContent(updatedContent);
      setStats(prev => ({
        ...prev,
        totalReportedContent: updatedContent.length,
        activeReports: updatedContent.filter(c => !c.resolved).length,
      }));
      alert(`${typeName} report resolved as '${action}'.`);
    } catch (error) {
      console.error(`Failed to resolve ${contentType} report:`, error);
      alert(`Error resolving ${contentType} report. Check console for details.`);
    }
  };
  const handleViewContent = async (item) => {
    const token = localStorage.getItem("token");
    let postIdToFetch = null;

    if (item.contentType === 'post') {
      postIdToFetch = item._id;
    } else if (item.contentType === 'comment' || item.contentType === 'reply') {
      postIdToFetch = item.postId; // Comments and replies should have a postId field
    }

    if (!postIdToFetch) {
      console.error("No postId found for item:", item);
      alert("Could not determine the post to view.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/posts/${postIdToFetch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPostForModal(response.data);
    } catch (error) {
      console.error("Failed to fetch post for modal:", error);
      alert("Failed to load the post. It might have been deleted.");
    }
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'users':
        return (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <UserIcon width={20} /> User Management
              </SectionTitle>
            </SectionHeader>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>User</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <UserInfo>
                            <UserAvatar 
                              src={`http://localhost:3001${user.picturePath || '/default-profile.png'}`} 
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                            <div>
                              <UserName>{user.firstName} {user.lastName}</UserName>
                              <UserEmail>{user.email}</UserEmail>
                            </div>
                          </UserInfo>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><RoleBadge role={user.role}>{user.role}</RoleBadge></TableCell>
                        <TableCell>
                          <ActionButton title="Toggle Role" onClick={() => handleUpdateRole(user._id, user.role)}><PencilIcon width={18} /></ActionButton>
                          <ActionButton title="Delete User" onClick={() => handleDeleteUser(user._id)} $danger><TrashIcon width={18} /></ActionButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan="4"><EmptyState>No users found</EmptyState></TableCell></TableRow>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </Section>
        );
      
      case 'reportedContent':
        return (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <ExclamationTriangleIcon width={20} /> Reported Content
              </SectionTitle>
            </SectionHeader>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Content</TableHeaderCell>
                    <TableHeaderCell>Author</TableHeaderCell>
                    <TableHeaderCell>Original Context</TableHeaderCell>
                    <TableHeaderCell>Reports</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {reportedContent.length > 0 ? (
                    reportedContent.map(item => (
                      <TableRow key={item.keyId} $isResolved={item.resolved}>
                        <TableCell>
                          <span style={{ 
                            textTransform: 'capitalize', padding: '4px 8px', borderRadius: '4px',
                            backgroundColor: item.contentType === 'post' ? '#e3f2fd' : item.contentType === 'comment' ? '#e8f5e9' : '#f3e5f5',
                            color: item.contentType === 'post' ? '#0d47a1' : item.contentType === 'comment' ? '#1b5e20' : '#4a148c'
                          }}>
                            {item.contentType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ReportedPostContent>
                            {item.description || item.text || item.comment || "No text content"} 
                            {item.reports?.length > 0 && (
                              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                                <strong>Reports:</strong>
                                <ul style={{ marginTop: "0.25rem", paddingLeft: "1rem" }}>
                                  {item.reports.slice(0, 3).map((report, i) => (
                                    <li key={i}>{report.reason} - {new Date(report.reportedAt).toLocaleDateString()}</li>
                                  ))}
                                  {item.reports.length > 3 && <li>+{item.reports.length - 3} more reports</li>}
                                </ul>
                              </div>
                            )}
                          </ReportedPostContent>
                        </TableCell>
                        <TableCell>
                           <UserInfo>
                            <UserAvatar 
                              src={`http://localhost:3001${item.userPicturePath || '/default-profile.png'}`} 
                              alt={item.userName || `${item.firstName} ${item.lastName}`}
                            />
                            <div><UserName>{item.userName || `${item.firstName} ${item.lastName}`}</UserName></div>
                          </UserInfo>
                        </TableCell>
                        <TableCell>
                          <ReportedPostContent>
                            {item.contentType === 'comment' && (item.postDescription || "N/A")}
                            {item.contentType === 'reply' && (item.commentText || "N/A")}
                            {item.contentType === 'post' && "N/A"}
                          </ReportedPostContent>
                        </TableCell>
                        <TableCell>{item.reports?.length || 0}</TableCell>
                        <TableCell>
                          <span style={{ color: item.resolved ? '#4caf50' : '#f44336', fontWeight: '500' }}>
                            {item.resolved ? 'Resolved' : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                           <ActionButton 
                                title="View Content" 
                                onClick={() => handleViewContent(item)} 
                              >
                                <EyeIcon width={18} />
                              </ActionButton>
                              {!item.resolved && (
                                <>
                              <ActionButton title={`Delete ${item.contentType}`} onClick={() => handleDeleteReportedContent(item)} $danger><TrashIcon width={18} /></ActionButton>
                              <ActionButton title="Mark as Resolved" onClick={() => handleResolveReportedContent(item, "ignore")}><CheckIcon width={18} /></ActionButton>
                            </>
                          )}
                           {item.resolved && ( <ActionButton title={`Delete ${item.contentType}`} onClick={() => handleDeleteReportedContent(item)} $danger><TrashIcon width={18} /></ActionButton> )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan="7"><EmptyState>No reported content found</EmptyState></TableCell></TableRow>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </Section>
        );

      case 'aiActivities':
        return (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <CpuChipIcon width={20} /> AI Model Activities
              </SectionTitle>
            </SectionHeader>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>User</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Content</TableHeaderCell>
                    <TableHeaderCell>Confidence</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {aiActivities.length > 0 ? (
                    aiActivities.map(activity => (
                      <TableRow key={activity._id}>
                        <TableCell>
                          <UserInfo>
                            <UserAvatar 
                              src={`http://localhost:3001${activity.user?.picturePath || '/default-profile.png'}`} 
                              alt={`${activity.user?.firstName || 'N/A'} ${activity.user?.lastName || ''}`}
                            />
                            <div>
                              <UserName>{activity.user?.firstName || 'Unknown'} {activity.user?.lastName || 'User'}</UserName>
                              <UserEmail>{activity.user?.email || 'No email'}</UserEmail>
                            </div>
                          </UserInfo>
                        </TableCell>
                        <TableCell>
                          <span style={{ textTransform: 'capitalize', padding: '4px 8px', borderRadius: '4px',
                            backgroundColor: activity.contentType === 'post' ? '#e3f2fd' : activity.contentType === 'comment' ? '#e8f5e9' : '#f3e5f5'
                          }}>
                            {activity.contentType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ReportedPostContent>
                            {activity.content.length > 100 ? `${activity.content.substring(0, 100)}...` : activity.content}
                            {activity.originalContent && (
                              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                                <strong>Original Post:</strong>
                                <p style={{ marginTop: "0.25rem" }}>
                                  {activity.originalContent.length > 100 ? `${activity.originalContent.substring(0, 100)}...` : activity.originalContent}
                                </p>
                              </div>
                            )}
                          </ReportedPostContent>
                        </TableCell>
                        <TableCell>
                          <div style={{ width: '100%', background: '#f5f5f5', borderRadius: '4px', height: '8px', marginBottom: '4px' }}>
                            <div style={{
                              width: `${activity.probability * 100}%`,
                              background: activity.probability > 0.7 ? '#f44336' : activity.probability > 0.5 ? '#ff9800' : '#4caf50',
                              height: '100%', borderRadius: '4px'
                            }}></div>
                          </div>
                          {(activity.probability * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>{new Date(activity.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span style={{ color: activity.wasBlocked ? '#f44336' : '#4caf50', fontWeight: '500' }}>
                            {activity.wasBlocked ? 'Blocked' : 'Allowed'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan="6"><EmptyState>No AI detection activities found</EmptyState></TableCell></TableRow>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </Section>
        );
      
      default:
        return <EmptyState>Select a view from the dropdown.</EmptyState>;
    }
  };

  return (
    <>
      <AdminContainer>
        <DashboardContainer>
          <DashboardHeader>
            <Title><ShieldCheckIcon width={28} /> Admin Dashboard</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}> 
                <Link to="/feed" style={{ textDecoration: 'none' }}>
                    <button style={{
                        padding: '8px 12px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <ArrowUturnLeftIcon width={18} /> View Employee Feed
                    </button>
                </Link>
            <DropdownContainer>
              <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {viewTitles[currentView]?.icon || <UserIcon width={18} /> }
                {viewTitles[currentView]?.title || "Select View"}  
                <ChevronDownIcon width={16} />
              </DropdownButton>
              <DropdownContent $isOpen={isDropdownOpen}>
                <DropdownItem onClick={() => { setCurrentView('users'); setIsDropdownOpen(false); }}>
                  <UserIcon width={18} /> User Management
                </DropdownItem>
                <DropdownItem onClick={() => { setCurrentView('reportedContent'); setIsDropdownOpen(false); }}>
                  <ExclamationTriangleIcon width={18} /> Reported Content
                </DropdownItem>
                <DropdownItem onClick={() => { setCurrentView('aiActivities'); setIsDropdownOpen(false); }}>
                  <CpuChipIcon width={18} /> AI Model Activities
                </DropdownItem>
              </DropdownContent>
            </DropdownContainer>
            </div> 
          </DashboardHeader>

          <StatsContainer>
            <StatCard><StatTitle><UserIcon width={16} />Total Users</StatTitle><StatValue>{stats.totalUsers}</StatValue></StatCard>
            <StatCard><StatTitle><ShieldCheckIcon width={16} />Admin Users</StatTitle><StatValue>{stats.adminUsers}</StatValue></StatCard>
            <StatCard><StatTitle><ExclamationTriangleIcon width={16} />Total Reported</StatTitle><StatValue>{stats.totalReportedContent}</StatValue></StatCard>
            <StatCard><StatTitle><CpuChipIcon width={16} />AI Detections</StatTitle><StatValue>{stats.aiDetections || 0}</StatValue></StatCard>
            <StatCard><StatTitle><ShieldExclamationIcon width={16} />Blocked Content</StatTitle><StatValue>{stats.blockedContent || 0}</StatValue></StatCard>
            <StatCard><StatTitle><ExclamationTriangleIcon width={16} />Active Reports</StatTitle><StatValue>{stats.activeReports}</StatValue></StatCard>
          </StatsContainer>

          {renderCurrentView()}
        </DashboardContainer>
      </AdminContainer>
     {selectedPostForModal && (
        <PostModal
          post={selectedPostForModal}
          onClose={() => setSelectedPostForModal(null)}
        />
      )}
    </>
  );
}; 
export default AdminDashboard;