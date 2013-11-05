# Install RabbitMQ Module
#

# Link Configuration Files
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq.config
ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0/etc/rabbitmq/enabled_plugins
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq-env.conf

# Create Directories
if [ ! -d ".dynamic" ]; then
  rm -rf .dynamic
  mkdir .dynamic
  mkdir .dynamic/pid
  mkdir .dynamic/cache
  mkdir .dynamic/logs
fi
