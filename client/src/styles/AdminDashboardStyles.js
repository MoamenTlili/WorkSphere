import styled from "styled-components";
import { UserIcon, DocumentTextIcon, ExclamationTriangleIcon, CheckIcon } from "@heroicons/react/24/outline";

export const AdminContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

export const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const StatTitle = styled.h3`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.text}90;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.primary}15;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.text}90;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  border: 2px solid ${({ theme }) => theme.primary};
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const UserName = styled.div`
  font-weight: 500;
`;

export const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text}80;
`;

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ role, theme }) => 
    role === 'admin' ? `${theme.primary}20` : '#e2e8f020'};
  color: ${({ role, theme }) => 
    role === 'admin' ? theme.primary : theme.text}80;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.text}80;
  transition: all 0.2s ease;
  margin-right: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.hover};
    color: ${({ theme, $danger }) => 
      $danger ? '#ff4d4d' : theme.primary};
    transform: scale(1.1);
  }
`;

export const ReportedPostContent = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.text}60;
`;



export const DropdownContainer = styled.div`
position: relative;
display: inline-block;
margin-right: 1rem;
`;

export const DropdownButton = styled.button`
display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.75rem 1.5rem;
background: ${({ theme }) => theme.primary}15;
color: ${({ theme }) => theme.primary};
border: 1px solid ${({ theme }) => theme.primary}50;
border-radius: 8px;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;

&:hover {
  background: ${({ theme }) => theme.primary}25;
}
`;

export const DropdownContent = styled.div`
position: absolute;
top: 100%;
left: 0;
background: ${({ theme }) => theme.cardBg};
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
border: 1px solid ${({ theme }) => theme.border};
z-index: 10;
min-width: 200px;
overflow: hidden;
display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

export const DropdownItem = styled.div`
padding: 0.75rem 1rem;
color: ${({ theme }) => theme.text};
cursor: pointer;
display: flex;
align-items: center;
gap: 0.5rem;
transition: all 0.2s ease;

&:hover {
  background: ${({ theme }) => theme.hover};
}

svg {
  width: 18px;
  height: 18px;
}
`;