namespace :aws do
  namespace :waf do
    namespace :log do
      desc 'Download the WAF access logs for the given day'
      task download: [:ensure_aws_credentials] do
        account_id = Dev::Aws::Credentials.new.logged_in_account
        account_name = Dev::Aws::Account.new.name_by_account(account_id)

        puts
        puts "  Current AWS Account is #{account_name} (#{account_id})".light_yellow
        puts
        bucket = ENV['BUCKET_NAME'] || Dev::Common.new.ask('Please provide the WAF logs bucket name', 'wafv2-bucketforawswafdeliverystream-dsowllrsgufk')
        type = ENV['TYPE'] || 'logs'
        date = ENV['DATE'] || Dev::Common.new.ask('Please provide the date of the logs', Time.now.strftime("%Y/%m/%d"))
        raise 'DATE must be in the form \'yyyy/mm/dd\'' unless date.match(%r{[0-9]{4}/[0-9]{2}/[0-9]{2}})

        year, month, day = date.split('/')
        prefix = "#{type}/#{year}/#{month}/#{day}/"
        dest_path = "#{ROOT_DIR}/build/#{bucket}"

        # Download all s3 files
        puts
        client = Aws::S3::Client.new
        Dev::Aws.each_page(client, :list_objects_v2, {bucket: , prefix:}) do |page|
          page.contents.each do |object|
            response_target = "#{dest_path}/#{object.key}"
            next if File.file?(response_target) && ENV['OVERWRITE'] != 'true'

            FileUtils.mkdir_p(File.dirname(response_target))
            puts "Downloading #{response_target}"
            client.get_object(
              bucket: ,
              key: object.key,
              response_target:
            )
          end
        end

        # Unzip all s3 files
        puts
        Dir.glob("#{dest_path}/**/*.gz").each do |zipfile|
          Zlib::GzipReader.open(zipfile) do |reader|
            puts "Extracting #{zipfile}"
            dest_file = zipfile.chomp('.gz')
            File.write(zipfile.chomp('.gz'), reader.read)
            FileUtils.rm_f(zipfile)
          end
        end
        puts
      end
    end
  end
end
