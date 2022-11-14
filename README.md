# PAD-Backend

PAD.

En este repositorio es menester tener un usuario activo para consumir los endpoints autorizados, para registrarse esta el endpoint POST '/auth/local/signUp' para logearse es el enpoint  POST'/auth/local/logIn' una vez registrado, en el endpoint POST '/api/studies/' puedes como usuario crear estudios de titulos y mediante el endpoint GET '/api/studies/:studyId' consultarlos por Id. por otro lado, como usuario puedes consumir el endpoint POST '/api/adPets' con el fin de solicitar a los admin la aprovacion para cambiar de rol a Advicer.


Como usuario Advicer, puedes consultar las solicitudes de estudio asignadAs en el endpoint  GET '/api/studies/advicer', tambien puedes consumir el endpoint POST'/api/advices/:studyId' para crear una respuesta asociada a la solicitud de estudio de titulo.

como usuario Admin, puedes listar todas las solicitudes para ser Advicer en el endpoint, GET '/api/adPets/adm', y aprobar solicitudes en el endpoint POST '/api/adPets/:petitionId'