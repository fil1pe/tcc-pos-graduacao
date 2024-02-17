export default async () => {
  await global.usersService.remove(global.user.cpf)
  await global.usersModule.close()
}
