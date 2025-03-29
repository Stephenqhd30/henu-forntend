import React from 'react';

interface Props {
  admin: API.AdminVO;
}

/**
 * 用户头像卡片
 * @param props
 * @constructor
 */
const AdminAvatarCard: React.FC<Props> = ({admin}) => {
  return (
    <span>{admin?.adminName}</span>
  );
};

export default AdminAvatarCard;
