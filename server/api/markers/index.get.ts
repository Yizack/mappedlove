export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const DB = useDb();
  return DB.select().from(tables.markers).all();
});
