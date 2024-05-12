import GlobalRepository from '../Repositories/GlobalRepository'
class GlobalService {
    globalRepository;
    constructor() {
        globalRepository = new GlobalRepository();
    }

    async getConfig() {
        return await globalRepository.getConfig();
    }
    async checkQuantity() {
        return await globalRepository.checkQuantity();
    }
    async rattingApp(payload) {
        return await globalRepository.rattingApp(payload);
    }
}

export default GlobalService;