import RestaurantRepository from '../repositories/RestaurantRespository';

class DeleteRestaurantService {
  repository: RestaurantRepository;

  constructor(repository: RestaurantRepository) {
    this.repository = repository;
  }

  async execute(restaurantId: string): Promise<string> {
    const restaurantIdDeleted = await this.repository.delete(restaurantId);
    return restaurantIdDeleted;
  }
}

export default DeleteRestaurantService;
