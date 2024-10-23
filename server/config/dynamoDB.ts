import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const database = new DynamoDBClient({ region: process.env.AWS_REGION });
