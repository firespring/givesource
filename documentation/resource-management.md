# Resource Management
The only resources that should be managed are DynamoDB tables. 

1. Access the [AWS-Console](aws-console.md).
2. Navigate to AWS DynamoDB.
3. Select the table you want to manage auto-scaling for and Select Capacity.
4. Update the read and write capacity scaling.

	| Table | High Read | High Write |
	| ----- | --------- | ---------- |
	| Contents | :heavy_check_mark: | :x: |
	| Donations** | :heavy_check_mark: | :heavy_check_mark: |
	| Donors | :x: | :heavy_check_mark: |
	| Files | :heavy_check_mark: | :x: |
	| Messages | :x: | :x: |
	| Metrics | :heavy_check_mark: | :heavy_check_mark: |
	| Nonprofit Donations | :heavy_check_mark: | :heavy_check_mark: |
	| Nonprofits** | :heavy_check_mark: | :x: |
	| Nonprofit Slides | :heavy_check_mark: | :x: |
	| Payment Transactions | :heavy_check_mark: | :heavy_check_mark: |
	| Reports | :x: | :x: |
	| Settings | :heavy_check_mark: | :x: |
	| Sponsors | :heavy_check_mark: | :x: |
	| Sponsor Tiers | :x: | :x: |
	| Users | :heavy_check_mark: | :x: |
	
	** highest traffic tables

5. All API endpoints are cached, so a "High Read" or "High Write" may not actually require a large scaling factor. Traffic also comes in bursts, and mostly focused on the giving
day itself. The auto-scaling rules that I typically start with are: 
	
	|     | Read capacity | Write capacity |
	| --- | ------------- | -------------- |
	| **Table utilization** | 70% | 70% |
	| **Minimum provisioned capacity** | 1 unit | 1 unit |
	| **Maximum provisioned capacity** | 20 units | 20 units |
	
6. For a larger event, like Give to Lincoln Day, I usually start the auto-scaling rules at:

	|     | Read capacity | Write capacity |
	| --- | ------------- | -------------- |
	| **Table utilization** | 70% | 70% |
	| **Minimum provisioned capacity** | 5 units | 5 units |
	| **Maximum provisioned capacity** | 50 units | 50 units |

7. I keep an eye on these capacities and update them as needed.

