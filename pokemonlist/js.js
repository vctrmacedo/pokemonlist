new Vue({
    el: '#app',
    data: {
        pokemons: [],
        currentPage: 1,
        pokemonsPerPage: 10,  // Quantidade de pokémons por página
        searchQuery: '',  // Termo de busca
        filteredPokemons: []  // Pokémons após a filtragem por nome
    },
    computed: {
        // Total de páginas
        totalPages() {
            return Math.ceil(this.filteredPokemons.length / this.pokemonsPerPage);
        },
        // Pokémons exibidos na página atual
        paginatedPokemons() {
            const start = (this.currentPage - 1) * this.pokemonsPerPage;
            const end = start + this.pokemonsPerPage;
            return this.filteredPokemons.slice(start, end);
        }
    },
    methods: {
        // Carrega pokémons da API
        fetchPokemons() {
            const pokemonIds = Array.from({ length: 1025 }, (_, i) => i + 1); // IDs dos Pokémon
            const requests = pokemonIds.map(id => 
                axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
            );
            
            Promise.all(requests)
                .then(responses => {
                    this.pokemons = responses.map(response => ({
                        id: response.data.id,
                        name: response.data.name,
                        image: response.data.sprites.versions["generation-v"]["black-white"].animated.front_default || response.data.sprites.front_default,
                        type: response.data.types[0].type.name,
                        weight: response.data.weight / 10, // Convertendo para kg
                        height: response.data.height / 10 // Convertendo para metros
                    }));
                    this.filteredPokemons = this.pokemons;  // Inicializando a lista de pokémons filtrados
                })
                .catch(error => console.error('Erro ao buscar os Pokémon:', error));
        },

        // Método de busca
        searchPokemons() {
            if (this.searchQuery === '') {
                this.filteredPokemons = this.pokemons;
            } else {
                this.filteredPokemons = this.pokemons.filter(pokemon => 
                    pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            this.currentPage = 1;  // Resetando para a primeira página após a busca
        },

        // Navegação para a página anterior
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        // Navegação para a próxima página
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        }
    },

    created() {
        this.fetchPokemons();  // Carregar pokémons na inicialização
    }
});