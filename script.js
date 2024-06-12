// Simula um banco de dados em memória
var clientes = [];

// Guarda o objeto que está sendo alterado
var clienteAlterado = null;

function adicionar() {
    // Libera para digitar o CPF
    document.getElementById("cpf").disabled = false;
    clienteAlterado = null;
    mostrarModal();
    limparForm();
}

function buscar(cpf) {
    return clientes.find(cliente => cliente.cpf === cpf);
}

function alterar(cpf) {
    // Procurar o cliente que tem o CPF clicado no alterar
    const cliente = buscar(cpf);
    if (cliente) {
        // Achou o cliente, então preenche o form
        document.getElementById("nome").value = cliente.nome;
        document.getElementById("cpf").value = cliente.cpf;
        document.getElementById("telefone").value = cliente.telefone;
        document.getElementById("whatsapp").value = cliente.whatsapp;
        document.getElementById("acoes").value = cliente.acoes;
        clienteAlterado = cliente;
        // Bloquear o CPF para não permitir alterá-lo
        document.getElementById("cpf").disabled = true;
        mostrarModal();
    } else {
        alert("Cliente não encontrado");
    }
}

function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        })
        .then(response => {
            // Após terminar de excluir, recarrega a lista de clientes. 
            recarregarClientes();
            alert("Cliente excluído com sucesso");
        })
        .catch(error => {
            console.log(error);
            alert("Não foi possível excluir o cliente");
        });
    }
}

function mostrarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "flex";
}

function ocultarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "none";
}

function cancelar() {
    ocultarModal();
    limparForm();
}

function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let whatsapp = document.getElementById("whatsapp").value;
    let acoes = document.getElementById("acoes").value;

    // Se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null) {
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "whatsapp": whatsapp,
            "acoes": acoes
        };

        // Salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {    
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        })
        .then(() => {
            alert("Cliente cadastrado com sucesso");
            // Adiciona o objeto cliente no vetor de clientes
            clientes.push(cliente);
            exibirDados(); // Atualiza a exibição dos dados na tabela
        })
        .catch(() => {
            alert("Ops... algo deu errado");
        });
    } else {
        clienteAlterado.nome = nome;
        clienteAlterado.telefone = telefone;
        clienteAlterado.whatsapp = whatsapp;
        clienteAlterado.acoes = acoes;

        fetch("http://localhost:3000/alterar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(clienteAlterado)
        })
        .then(response => {
            recarregarClientes();
            alert("Cliente alterado com sucesso");
        })
        .catch(error => {
            alert("Não foi possível alterar o cliente");
        });
    }

    clienteAlterado = null;

    // Limpa o form
    limparForm();

    ocultarModal();
}

function exibirDados() {
    let tbody = document.querySelector("#table-customers tbody");

    // Limpa todas as linhas antes de listar os clientes
    tbody.innerHTML = "";

    for (let i = 0; i < clientes.length; i++) {
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>
            <td>${clientes[i].whatsapp}</td>
            <td>${clientes[i].acoes}</td>
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`;
        
        let tr = document.createElement("tr");
        tr.innerHTML = linha;

        tbody.appendChild(tr);
    }
}

function limparForm() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("whatsapp").value = "";
    document.getElementById("acoes").value = "";
}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {    
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(response => {
        console.log(response);
        clientes = response; // Recebe os clientes do back-end
        exibirDados();
    })
    .catch(error => {
        alert("Erro ao listar clientes");
    });
}
