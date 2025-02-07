export enum Permission {
  // User permissions
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  INVITE_USER = 'invite:user',

  READ_INVITED_USER = 'read:invited-user',
  UPDATE_INVITED_USER = 'update:invited-user',
  DELETE_INVITED_USER = 'delete:invited-user',

  // Role permissions
  CREATE_ROLE = 'create:role',
  READ_ROLE = 'read:role',
  UPDATE_ROLE = 'update:role',
  DELETE_ROLE = 'delete:role',

  // Item permissions
  CREATE_ITEM = 'create:item',
  READ_ITEM = 'read:item',
  UPDATE_ITEM = 'update:item',
  DELETE_ITEM = 'delete:item',
}
