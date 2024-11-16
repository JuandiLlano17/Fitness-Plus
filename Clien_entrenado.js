$(document).ready(function () {
    // Realizar la llamada AJAX para obtener los datos de los clientes desde el servidor
    $.ajax({
        url: 'api/GET/obtener_cliente.php',  // La URL de tu servidor
        method: 'GET',
        dataType: 'json',
        success: function (data) {
  
            console.log(data); // Mostrar los datos en la consola
  
            // Llenar los datos de los clientes en los contenedores
            data.forEach(function(cliente, index) {
                const tipoCuerpo = determinarTipologia(cliente.Medida_Muñeca); // Usamos la función para determinar la tipología corporal
                $('#cliente-' + (index + 1) + ' #nombre-cliente').text(cliente.Nombre + ', ' + cliente.Edad);
                $('#cliente-' + (index + 1) + ' #imagen-perfil').attr('src', cliente.Imagen_Perfil);
                $('#cliente-' + (index + 1) + ' #tipoCuerpoCliente').text(tipoCuerpo);
                $('#cliente-' + (index + 1) + ' #dias-entreno').text(cliente.Dias_Entreno);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar los datos: ', error);
        }
    });
  });
  
  // Función para determinar la tipología corporal
  function determinarTipologia(medidaMuñeca) {
    if (medidaMuñeca < 17) {
        return "Ectomorfo";
    } else if (medidaMuñeca >= 17 && medidaMuñeca <= 20) {
        return "Mesomorfo";
    } else {
        return "Endomorfo";
    }
  }