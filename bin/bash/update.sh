# Update RabbitMQ Module
#

# Create Directories
if [ ! -d ".dynamic" ]; mkdir .dynamic; fi
if [ ! -d ".dynamic/cache" ]; mkdir .dynamic/cache; fi
if [ ! -d ".dynamic/pid" ]; mkdir .dynamic/pid; fi
if [ ! -d ".dynamic/log" ]; mkdir .dynamic/log; fi

# Link Configuration Files
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq.config
ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0/etc/rabbitmq/enabled_plugins
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0-mac/etc/rabbitmq/rabbitmq.config
ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0-mac/etc/rabbitmq/enabled_plugins
