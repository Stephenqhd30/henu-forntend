/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: InitialState | undefined) {
  const { currentAdmin } = initialState ?? {};
  return {
    canUser: currentAdmin,
    canAdmin: currentAdmin && currentAdmin.adminType === 'system_admin',
  };
}
