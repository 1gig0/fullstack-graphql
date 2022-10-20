const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');

const typeDefs = gql`
    """
    Do this here that show up in tools.
    """
   type User {
       email: String!
       avatar: String
       friends: [User]!
       shoes: [Shoe]! 
   }

    enum ShoeBrandType {
        JORDAN
        NIKE
        ADIDAS
    }

   interface Shoe {
       brand: ShoeBrandType!
       size: Int!
       user: User!
   }
    
    type Sneaker implements Shoe {
        brand: ShoeBrandType!
        size: Int!
        user: User!
        sport: String!
    }
    
    type Boot implements Shoe {
        brand: ShoeBrandType!
        size: Int!
        user: User!
        hasGrip: Boolean!
    }

    union FootWear = Sneaker | Boot

    input ShoesInput {
       brand: ShoeBrandType
       size: Int
   }

   input newShoeInput {
       brand: ShoeBrandType!
       size: Int!
   }
   
   type Query {
       me: User!
       friends: [User]!
       avatars: [String!]!
       shoes(input: ShoesInput): [Shoe]!
       shoesUnion(input: ShoesInput): [FootWear]!
   }
   
   type Mutation {
       newShoe(input: newShoeInput!): Shoe!
   }
`
const user = {
  email: 'gig@gmail.com',
  friends: [],
  shoes: []
}

const shoes = [
  {brand: 'NIKE', size: 7, sport: 'basketball', user: 1},
  {brand: 'ADIDAS', size: 17, hasGrip: true, user: 1}
];

const resolvers = {
  Query: {
    shoes(_, {input}) {
      return shoes.filter(shoe => {
        if (input?.brand) {
          return shoe.brand === input.brand
        }
        return shoe;
      }).filter(shoe => {
        if (input?.size) {
          return shoe.size === input.size
        }
        return shoe;
      })
    },

    shoesUnion(_, {input}) {
      return [
        {brand: 'NIKE', size: 7, sport: 'basketball'},
        {brand: 'ADIDAS', size: 17, hasGrip: true}
      ].filter(shoe => {
        if (input?.brand) {
          return shoe.brand === input.brand
        }
        return shoe;
      }).filter(shoe => {
        if (input?.size) {
          return shoe.size === input.size
        }
        return shoe;
      })
    },

    me() {
      return user;
    },

    friends() {
      return [
        {
          email: 'test@gmail.com',
          avatar: 'http://avatar.png',
          friends: []
        },
        {
          email: 'test1@gmail.com',
          avatar: 'http://avatar.png',
          friends: []
        }
      ];
    },

    avatars() {
      return ['http://avatar.png'];
    }
  },

  Mutation: {
    newShoe(_, {input}) {
      return input;
    }
  },

  User: {
    shoes(user) {
      return shoes;
    }
  },

  Shoe: {
    __resolveType(shoe) {
      if (shoe.sport) {
        return 'Sneaker'
      }
      return 'Boot'
    }
  },

  Sneaker: {
    user(shoe) {
      return user;
    }
  },

  Boot: {
    user(shoe) {
      return user;
    }
  },

  FootWear: {
    __resolveType(shoe) {
      if (shoe.sport) {
        return 'Sneaker'
      }
      return 'Boot'
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
  .then(() => console.log('on port: 4000'))
