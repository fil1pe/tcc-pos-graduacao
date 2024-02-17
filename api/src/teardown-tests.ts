export default async () => {
  await global.establishmentsService.remove(
    global.user.cpf,
    global.establishment.cnpj,
  )
  await global.usersService.remove(global.user.cpf)
  await global.usersModule.close()
}
