const { RDS } = require('aws-sdk');
exports.handler = async (event, context, callback) => {
    const dbClusterIdentifer = 'joe-test-auroradbstack-tdiexov3y6pk-rdscluster-1bigheuwoqijj';
    const sourceRegion = 'us-east-1';
    const destinationRegion = 'us-west-2';
    const rds = new RDS({region: sourceRegion});
    let params = {
        DBClusterIdentifier: dbClusterIdentifer,
        SnapshotType: 'automated'
    };
    // TODO: Change back to const
    var { DBClusterSnapshots } = await rds.describeDBClusterSnapshots(params).promise();
    DBClusterSnapshots = DBClusterSnapshots.slice(0, 1);
    DBClusterSnapshots.forEach(async function(item) {
        let dateTagKey = 'SnapshotCreateTime';
        let dateTag = item.TagList.find(tag => tag['Key'] == dateTagKey);
        if (!dateTag) {
            console.log(`Tagging ${item.DBClusterSnapshotIdentifier} with ${dateTagKey}`);
            let params = {
                ResourceName: item.DBClusterSnapshotArn,
                Tags: [
                    {
                        Key: dateTagKey,
                        Value: item.SnapshotCreateTime.toISOString()
                    }
                ]
            };
            await rds.addTagsToResource(params).promise();
        };

        let copyTagKey = `CopiedTo:${destinationRegion}`;
        let copyTag = item.TagList.find(tag => tag['Key'] == copyTagKey);
        if (!copyTag) {
            console.log(`Starting copy of ${item.DBClusterSnapshotIdentifier} to ${destinationRegion}`);
            let params = {
                SourceDBClusterSnapshotIdentifier: item.DBClusterSnapshotIdentifier,
                TargetDBClusterSnapshotIdentifier: 'joetest2',
                CopyTags: true,
                SourceRegion: process.env.AWS_DEFAULT_REGION,
                DestinationRegion: destinationRegion
            };
            await rds.copyDBClusterSnapshot(params).promise();
            // Copy to the destination region

            // Add a tag keeping track of images we have copied
            console.log(`Tagging ${item.DBClusterSnapshotIdentifier} with ${copyTagKey}`);
            params = {
                ResourceName: item.DBClusterSnapshotArn,
                Tags: [
                    {
                        Key: copyTagKey,
                        Value: 'true'
                    }
                ]
            };
            //await rds.addTagsToResource(params).promise();
        };
        //console.log(item);
        return;
    });

//    //callback(null);
};

exports.handler();
