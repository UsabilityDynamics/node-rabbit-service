# Install RabbitMQ Module
#

# Link Configuration Files
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq.config
ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0/etc/rabbitmq/enabled_plugins
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq-env.conf

# Create Directories
if [ ! -d ".dynamic" ]; then mkdir .dynamic; fi
if [ ! -d ".dynamic/pid" ]; then mkdir .dynamic/pid; fi
if [ ! -d ".dynamic/cache" ]; then mkdir .dynamic/cache; fi
if [ ! -d ".dynamic/logs" ]; then mkdir .dynamic/logs; fi

# Link Binaries
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmq-defaults bin/rabbitmq-defaults
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmq-env bin/rabbitmq-env
