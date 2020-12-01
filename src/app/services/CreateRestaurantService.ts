import RestaurantRepository from '../repositories/RestaurantRespository';

class CreateRestaurantService {
  repository: RestaurantRepository;

  constructor(repository: RestaurantRepository) {
    this.repository = repository;
  }

  async execute({
    photoUri, name, address, businessHours,
  }: {
    photoUri: string;
    name: string;
    address: string;
    businessHours: string,
  }): Promise<string> {
    const restaurantIdCreated = await this.repository.create({
      photoUri, name, address, businessHours,
    });

    return restaurantIdCreated;
  }
}

export default CreateRestaurantService;
