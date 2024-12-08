interface IOrganizationType {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateOrganization {
  name: string;
  slug: string;
  ownerEmail: string;
}
